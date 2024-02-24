#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs";
import path from "node:path";
import { program } from "commander";
import { execSync } from "node:child_process";

async function generateAuthFormComponent(options) {
	const { folderPath, fileName, componentName, extension, allAnswers } =
		options;

	try {
		if (!fs.existsSync(folderPath)) {
			await fs.mkdirSync(folderPath, { recursive: true });
		}
	} catch (error) {
		console.log(error);
	}

	const componentCode = `
        import React from "react";
        import AuthForm from "auth-em-form";

        const ${componentName}: React.FC = () => {
			
			const handleSubmit = (
				formData: { [key: string]: string },
				action: "signIn" | "signUp"
			) => {
				// Your sign-up logic here
				console.log("Sign up form submitted with data:", formData);
			};

            return (
                <AuthForm
                    headingText="${allAnswers.headingText}"
                    action="${allAnswers.action}"
                    onSubmit={handleSubmit}
                    validation={${allAnswers.validation}}
                    encryptPassword={${allAnswers.encryptPassword || false}}
                    saltRounds={${allAnswers.saltRounds || 10}}
                    socialLoginEnabled={${
											allAnswers.socialLoginEnabled || false
										}}
                    socialLoginPosition="${
											allAnswers.socialLoginPosition || "top"
										}"
                    onSocialLogin={undefined}
                />
            );
        }
        export default ${componentName};
    `;

	const filePath = `${folderPath}/${fileName}.${extension}`;
	await fs.writeFileSync(filePath, componentCode);
	console.log(`AuthForm component generated successfully at ${filePath}!`);
}

async function promptUserForOptions() {
	const folderAnswer = await inquirer.prompt([
		{
			type: "input",
			name: "folder",
			message:
				'Enter the folder to add the created component (or use "components" folder by default):',
			default: "components",
		},
	]);

	const fileNameAnswer = await inquirer.prompt([
		{
			type: "input",
			name: "fileName",
			message: "Enter the file name for the component:",
		},
	]);

	const componentNameAnswer = await inquirer.prompt([
		{
			type: "input",
			name: "componentName",
			message: "Enter the component name:",
		},
	]);

	const languageAnswer = await inquirer.prompt([
		{
			type: "list",
			name: "language",
			message: "Choose the language to create the component:",
			choices: ["javascript", "typescript"],
		},
	]);

	let extensionChoices = ["js", "jsx"];
	if (languageAnswer.language === "typescript") {
		extensionChoices = ["ts", "tsx"];
	}

	const extensionAnswer = await inquirer.prompt([
		{
			type: "list",
			name: "extension",
			message: "Choose the file extension:",
			choices: extensionChoices,
		},
	]);

	const answers = await inquirer.prompt([
		{
			type: "input",
			name: "headingText",
			message: "Enter the heading text for the form:",
		},
		{
			type: "list",
			name: "action",
			message: "Select the action type:",
			choices: ["signIn", "signUp"],
		},
		{
			type: "confirm",
			name: "encryptPassword",
			message: "Encrypt password for sign-up? (y/n):",
			when: (answers) => answers.action === "signUp",
			validate: (input) =>
				["y", "n"].includes(input.toLowerCase()) ? true : "Please enter y/n.",
		},
		{
			type: "number",
			name: "saltRounds",
			message: "Enter the number of salt rounds for password encryption:",
			when: (answers) => answers.encryptPassword === "y",
		},
		{
			type: "confirm",
			name: "validation",
			message: "Enable validation? (y/n):",
			validate: (input) =>
				["y", "n"].includes(input.toLowerCase()) ? true : "Please enter y/n.",
		},
		{
			type: "confirm",
			name: "socialLoginEnabled",
			message: "Enable social login? (y/n):",
			validate: (input) =>
				["y", "n"].includes(input.toLowerCase()) ? true : "Please enter y/n.",
		},
		{
			type: "list",
			name: "socialLoginPosition",
			message: "Select the position of social login buttons:",
			choices: ["top", "bottom"],
			when: (answers) => answers.socialLoginEnabled === "y",
		},
	]);

	const folderPath = folderAnswer.folder;
	const fileName = fileNameAnswer.fileName;
	const componentName = componentNameAnswer.componentName;
	const language = languageAnswer.language;
	const extension = extensionAnswer.extension;
	const allAnswers = answers;

	const options = {
		folderPath,
		fileName,
		componentName,
		language,
		extension,
		allAnswers,
	};

	generateAuthFormComponent(options);
}

async function promptPackageManager() {
	const answers = await inquirer.prompt([
		{
			type: "list",
			name: "packageManager",
			message: "Select your preferred package manager:",
			choices: ["npm", "yarn", "pnpm"],
			default: "npm",
		},
	]);
	return answers.packageManager;
}

async function promptPnpmWorkspaceOption() {
	const answers = await inquirer.prompt([
		{
			type: "confirm",
			name: "usePnpmWorkspace",
			message: "Are you using pnpm workspaces? (y/n):",
			default: "n",
			validate: (input) =>
				["y", "n"].includes(input.toLowerCase()) ? true : "Please enter y/n.",
		},
	]);
	return answers.usePnpmWorkspace;
}

async function findPackageJson(currentPath) {
	const files = await fs.readdirSync(currentPath);

	if (files.includes("package.json")) {
		return currentPath;
	}

	for (const file of files) {
		const filePath = path.join(currentPath, file);
		const stats = await fs.statSync(filePath);

		if (stats.isDirectory()) {
			const result = await findPackageJson(filePath);
			if (result) {
				return result;
			}
		}
	}

	return null;
}

async function checkAndInstallPackage(
	packageName,
	packageManager,
	useWorkspace
) {
	const projectPath = await findPackageJson(process.cwd());

	if (!projectPath) {
		console.error(
			"Error: package.json not found in the current directory or its subdirectories."
		);
		process.exit(1);
	}

	let installCmd;
	if (packageManager === "yarn") {
		installCmd = `yarn add ${packageName} `;
	} else if (packageManager === "pnpm") {
		installCmd = `pnpm add ${packageName}`;
		if (useWorkspace) {
			installCmd += " --workspace";
		}
	} else if (packageManager === "npm") {
		installCmd = `npm install ${packageName}`;
	}

	try {
		// Execute installation command in the user's project directory
		execSync(installCmd, { cwd: projectPath, stdio: "inherit" });
		console.log(`${packageName} has been successfully installed.`);
		console.log();
	} catch (error) {
		console.error(
			`Error occurred while installing ${packageName}: ${error.message}`
		);
		process.exit(1);
	}
}

async function initialize() {
	program.option("-h, --help", "display information for cli");
	program.parse(process.argv);

	const options = program.opts();

	if (options.help) {
		program.outputHelp();
		console.log();
		console.log(
			"headingText: The heading text displayed on the authentication form."
		);
		console.log(
			"action: The action type of the form, either 'signIn' or 'signUp'."
		);
		console.log(
			"fields: An array of field configurations defining the form fields."
		);
		console.log(
			"onSubmit: Callback function invoked when the form is submitted."
		);
		console.log("customStyles: Custom styles to apply to form elements.");
		console.log("validation: Enable or disable form validation.");
		console.log(
			"validationErrors: Object containing validation errors for form fields."
		);
		console.log(
			"submitIcon: Icon component to display next to the submit button."
		);
		console.log(
			"submitIconPosition: Position of the submit icon, either 'left' or 'right'."
		);
		console.log(
			"encryptPassword: Boolean indicating whether to encrypt passwords using bcrypt."
		);
		console.log(
			"saltRounds: Number of salt rounds used for password encryption."
		);
		console.log(
			"customValidationSchema: Custom Yup validation schema for form fields."
		);
		console.log(
			"socialLoginEnabled: Enable or disable social login integration."
		);
		console.log(
			"socialLoginPosition: Position of social login buttons, either 'top' or 'bottom'."
		);
		console.log(
			"socialLoginStyles: Custom styles to apply to social login buttons."
		);
		console.log(
			"socialLoginProviders: Array of social login provider configurations or provider names."
		);
		console.log("socialButtonOptions: Options for social login buttons.");
		console.log(
			"onSocialLogin: Callback function invoked when a social login provider button is clicked."
		);
		console.log(
			"integratedComponents: Integrated components to include in the form."
		);
	} else {
		const packageManager = await promptPackageManager();

		if (packageManager === "pnpm") {
			const usePnpmWorkspace = await promptPnpmWorkspaceOption();
			await checkAndInstallPackage(
				"auth-em-form",
				packageManager,
				usePnpmWorkspace
			);
		} else {
			await checkAndInstallPackage("auth-em-form", packageManager);
		}
		await promptUserForOptions();
	}
}

await initialize();

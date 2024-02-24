# Auth Em Form CLI

<div align="center">

![Logo](./assets/logo/AuthForm.png)

</div>
---

## `auth-em-form-cli` Documentation

### Optional Installation

### Overview

`auth-em-form-cli` is a Command-Line Interface (CLI) tool designed to simplify the process of generating authentication form components for React applications using `auth-em-form` library. This tool provides an interactive interface to configure various options for generating the authentication form component.

### Installation

To use `auth-em-form-cli`, you need to have Node.js installed on your system. You can install `auth-em-form-cli` globally using npm by running the following command:

<br/>

```bash
npm install -g auth-em-form-cli
OR
yarn global add auth-em-form-cli
OR
pnpm add -g auth-em-form-cli
```

### Usage

Once installed, you can use `auth-em-form-cli` from the command line. Simply run the following command:

<br/>

```bash
npx auth-em-form-cli
OR
pnpm exec auth-form-cli
```

### Prompts

When you run `auth-em-form-cli`, you will be prompted to provide various options for generating the authentication form component. Below are the expected prompts and their descriptions:

1. **Folder to Add Component:**
   - Description: Enter the folder where the generated component will be added. You can use the "components" folder by default.
   - Prompt: `Enter the folder to add the created component (or use "components" folder by default):`

2. **File Name for Component:**
   - Description: Enter the file name for the component.
   - Prompt: `Enter the file name for the component:`

3. **Component Name:**
   - Description: Enter the name of the component.
   - Prompt: `Enter the component name:`

4. **Language:**
   - Description: Choose the language to create the component (JavaScript or TypeScript).
   - Prompt: `Choose the language to create the component:`

5. **File Extension:**
   - Description: Choose the file extension for the component file.
   - Prompt: `Choose the file extension:`

6. **Heading Text for Form:**
   - Description: Enter the heading text for the authentication form.
   - Prompt: `Enter the heading text for the form:`

7. **Action Type:**
   - Description: Select the action type of the form (Sign In or Sign Up).
   - Prompt: `Select the action type:`

8. **Encrypt Password:**
   - Description: Choose whether to encrypt passwords for sign-up.
   - Prompt: `Encrypt password for sign-up? (y/n):`

9. **Salt Rounds:**
   - Description: Enter the number of salt rounds for password encryption.
   - Prompt: `Enter the number of salt rounds for password encryption:`

10. **Enable Validation:**
    - Description: Choose whether to enable form validation.
    - Prompt: `Enable validation? (y/n):`

11. **Enable Social Login:**
    - Description: Choose whether to enable social login integration.
    - Prompt: `Enable social login? (y/n):`

12. **Social Login Position:**
    - Description: Select the position of social login buttons.
    - Prompt: `Select the position of social login buttons:`

### Examples

Below are some examples of how to use `auth-em-form-cli` with different options:

- Generate a JavaScript authentication form component in the default "components" folder with default settings:

  ```bash
  npx auth-em-form-cli
  ```

- Generate a TypeScript authentication form component named "AuthForm" in the "auth" folder with encryption enabled and social login disabled:

  ```bash
  npx auth-em-form-cli
  Enter the folder to add the created component (or use "components" folder by default): ./src/auth
  Enter the file name for the component: AuthForm
  Enter the component name: AuthForm
  Choose the language to create the component: TypeScript
  Choose the file extension: ts
  Enter the heading text for the form: User Authentication
  Select the action type: Sign Up
  Encrypt password for sign-up? (y/n): y
  Enter the number of salt rounds for password encryption: 12
  Enable validation? (y/n): y
  Enable social login? (y/n): n
  ```

### Additional Information

For additional information and options, you can use the `-h, --help` option to display help information:

```bash
npx auth-em-form-cli --help
```

## Creator

AuthForm component is created and maintained by [Ethern Myth](https://github.com/Ethern-Myth). Feel free to reach out with any questions or feedback!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

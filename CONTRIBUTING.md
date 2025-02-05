# Contributing Guidelines

Thank you for your interest in contributing to the project! I welcome contributions from the community and am pleased that you are interested in helping me make this project better.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue tracker to avoid duplicates. When you create a bug report, include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed and what behavior you expected to see
- Include screenshots if applicable
- Include details about your configuration and environment

### Suggesting Enhancements

If you have a suggestion for improving the project, we'd love to hear it. Please provide:

- A clear and detailed explanation of the feature
- The motivation behind the suggestion
- Any potential alternatives you've considered
- Examples of how this enhancement would be used

### Pull Requests

1. Fork the repository
2. Create a new branch for your feature (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run any tests and linting tools
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

#### Pull Request Guidelines

- Follow the existing code style and conventions
- Update documentation as needed
- Add tests for new features
- Keep commits focused and atomic
- Write clear, descriptive commit messages
- Reference any relevant issues

## Development Setup

### Prerequisites

Before getting started with toolbar-status-chips, ensure your runtime environment meets the following requirements:

- **Programming Language:** TypeScript
- **Package Manager:** Npm

### Installation

Install toolbar-status-chips using one of the following methods:

**Build from source:**

1. Clone the toolbar-status-chips repository:

```sh
❯ git clone https://github.com/homeassistant-extras/toolbar-status-chips
```

2. Navigate to the project directory:

```sh
❯ cd toolbar-status-chips
```

3. Install the project dependencies:

**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm install
```

### Usage

Run parcel using the following command:
**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm run watch
```

Or to do a single build

```sh
❯ npm run build
```

## Documentation

- Keep READMEs and other documentation up to date
- Use clear, concise language
- Include examples where appropriate
- Document any new features or changes in behavior

## Questions?

If you have any questions, please feel free to:

- Open an issue with the question label
- Contact me here on GitHub

<!-- prettier-ignore-start -->

##  Features

|      | Feature         | Summary       |
| :--- | :---:           | :---          |
| ⚙️  | **Architecture**  | <ul><li>Modular development architecture, with a focus on isolation of modules.</li><li>Utilizes a task-based architecture to dynamically update chip configuration based on user-provided settings and entity changes.</li><li>Integrates with other parts of the project structure to provide a seamless user experience.</li></ul> |
| 🔩 | **Code Quality**  | <ul><li>Follows best practices for coding style, including Prettier integration for code formatting.</li><li>Utilizes TypeScript as the primary programming language, ensuring strict type checking and compatibility with modern JavaScript features.</li><li>Enforces a standardized configuration structure for Home Assistant entities, devices, and themes, enabling standardized data exchange and manipulation across the application.</li></ul> |
| 📄 | **Documentation**  | <ul><li>Provides detailed documentation on project usage, including installation commands, test commands, and usage commands.</li><li>Maintains a primary language of TypeScript, with language counts for JSON, TS, YAML, and YML files.</li><li>Includes a standardized configuration file (hacs.json) for the entire codebase, providing metadata about the project.</li></ul> |
| 🔌 | **Integrations**  | <ul><li>Integrates with Parcel, a popular development tool, facilitating efficient builds and watches.</li><li>Utilizes GitHub Actions for automated deployment and release management.</li><li>Enables seamless integration with Home Assistant's entity data to filter and render relevant chips.</li></ul> |
| 🧩 | **Modularity**    | <ul><li>Emphasizes modular development, with a focus on isolation of modules and reusable UI components.</li><li>Utilizes a task-based architecture to dynamically update chip configuration based on user-provided settings and entity changes.</li><li>Provides a unified configuration structure for Home Assistant entities, devices, and themes, enabling standardized data exchange and manipulation across the application.</li></ul> |
| 🧪 | **Testing**       | <ul><li>Automates testing using GitHub Actions, ensuring that only authorized commits are allowed to trigger a release.</li><li>Maintains automated fast-forward checks on pull requests, ensuring the integrity of the repository's history.</li><li>Enforces robustness with fallback logic for missing attribute values, ensuring entities remain functional even when data is incomplete.</li></ul> |
| ⚡️  | **Performance**   | <ul><li>Optimizes project configuration using TypeScript compiler options, ensuring compatibility with modern JavaScript features and efficient compilation.</li><li>Simplifies project layout by defining global styles for the application, creating a consistent visual experience across the project.</li><li>Utilizes a standardized configuration structure for Home Assistant entities, devices, and themes, enabling efficient data exchange and manipulation.</li></ul> |

---

##  Project Structure

```sh
└── toolbar-status-chips/
    ├── .github
    │   ├── pull_request_template.md
    │   └── workflows
    │       ├── merge.yaml
    │       ├── pull_request.yaml
    │       └── push.yml
    ├── CONTRIBUTING.md
    ├── LICENSE
    ├── README.md
    ├── assets
    │   ├── area-status.png
    │   ├── chips.png
    │   ├── mobile-bottom-nav.PNG
    │   ├── status-labels.png
    │   └── status-patch-chips.png
    ├── hacs.json
    ├── package-lock.json
    ├── package.json
    ├── src
    │   ├── card.ts
    │   ├── config.ts
    │   ├── entity.ts
    │   ├── helpers.ts
    │   ├── index.ts
    │   ├── styles.ts
    │   └── types.ts
    └── tsconfig.json
```


###  Project Index
<details open>
	<summary><b><code>TOOLBAR-STATUS-CHIPS/</code></b></summary>
	<details> <!-- __root__ Submodule -->
		<summary><b>__root__</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/homeassistant-extras/toolbar-status-chips/blob/master/package-lock.json'>package-lock.json</a></b></td>
				<td>- **Summary**

The `package-lock.json` file serves as the central configuration file for the `toolbar-status-card` project, which is a part of a larger codebase architecture<br>- This file ensures that all dependencies required by the project are properly locked and managed.

In essence, this file achieves several key purposes:

*   **Dependency Management**: It specifies the versions of all dependencies required by the project, ensuring consistency across different environments.
*   **Project Stability**: By locking in specific versions of dependencies, it helps maintain a stable project environment, reducing the risk of unexpected behavior or compatibility issues.
*   **Reproducibility**: The file enables reproducible builds and deployments by providing a clear understanding of the project's dependency requirements.

Overall, the `package-lock.json` file plays a crucial role in ensuring the reliability, consistency, and scalability of the `toolbar-status-card` project within the larger codebase architecture.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/homeassistant-extras/toolbar-status-chips/blob/master/package.json'>package.json</a></b></td>
				<td>- The package.json file serves as the central hub for managing dependencies and scripts for the toolbar-status-card project<br>- It enables the creation of custom status badges for Home Assistant in the toolbar, streamlining user interface updates and maintenance<br>- The file's configuration ensures seamless integration with Parcel, a popular development tool, facilitating efficient builds and watches.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/homeassistant-extras/toolbar-status-chips/blob/master/tsconfig.json'>tsconfig.json</a></b></td>
				<td>- Optimizes project configuration by defining compiler options for the TypeScript compiler<br>- Ensures compatibility with modern JavaScript features and enables strict type checking<br>- Aligns with the project's overall architecture, which emphasizes modular development and isolation of modules<br>- Facilitates efficient compilation and error handling, ultimately contributing to a stable and maintainable codebase.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/homeassistant-extras/toolbar-status-chips/blob/master/hacs.json'>hacs.json</a></b></td>
				<td>- Architects the project's core functionality by defining a standardized configuration file for the entire codebase<br>- The hacs.json file serves as a central hub, providing metadata about the project, including its name and rendering of the README<br>- It enables efficient management of dependencies and facilitates seamless integration with other components within the project structure.</td>
			</tr>
			</table>
		</blockquote>
	</details>
	<details> <!-- src Submodule -->
		<summary><b>src</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/homeassistant-extras/toolbar-status-chips/blob/master/src/helpers.ts'>helpers.ts</a></b></td>
				<td>- The provided code file enables the processing of entities by merging them with their current states from Home Assistant, filtering based on inclusion criteria, and formatting the final entity objects<br>- It achieves this by utilizing two helper functions, `shouldIncludeEntity` and `mergeArraysUsingMapObject`, to determine which entities should be included in the output.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/homeassistant-extras/toolbar-status-chips/blob/master/src/styles.ts'>styles.ts</a></b></td>
				<td>- Simplifies project layout by defining global styles for the application<br>- The `styles` constant exports a CSS rule that sets the position and z-index of an element with the id 'chips', creating a consistent visual experience across the project<br>- This simplification contributes to a more cohesive user interface, aligning with the overall goal of providing a seamless and intuitive experience for users.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/homeassistant-extras/toolbar-status-chips/blob/master/src/entity.ts'>entity.ts</a></b></td>
				<td>- Validates the state of Home Assistant entities, determining their active status, numeric state, and color based on predefined thresholds or custom attributes<br>- Achieves a balance between entity management and user experience by providing clear visual cues through icon colors<br>- Ensures robustness with fallback logic for missing attribute values, ensuring entities remain functional even when data is incomplete.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/homeassistant-extras/toolbar-status-chips/blob/master/src/card.ts'>card.ts</a></b></td>
				<td>- The `ToolbarStatusChips` class enables the display of chip-based status indicators on a toolbar, leveraging Home Assistant's entity data to filter and render relevant chips<br>- It achieves this by utilizing a task-based architecture to dynamically update the chip configuration based on user-provided settings and entity changes<br>- The component integrates with other parts of the project structure to provide a seamless user experience.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/homeassistant-extras/toolbar-status-chips/blob/master/src/types.ts'>types.ts</a></b></td>
				<td>- Provides a unified configuration structure for Home Assistant entities, devices, and themes, enabling standardized data exchange and manipulation across the application<br>- Enables flexible display of entity labels, status paths, and theme settings, while also tracking entity states and attributes<br>- Facilitates a cohesive architecture for managing Home Assistant instances and their associated data.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/homeassistant-extras/toolbar-status-chips/blob/master/src/index.ts'>index.ts</a></b></td>
				<td>- Registering custom elements is the primary purpose of the `src/index.ts` file<br>- It enables the integration of a new web component, `ToolbarStatusChips`, into the project's architecture<br>- By defining the component and registering it with the browser, this code facilitates the reuse of UI components across different parts of the application, enhancing modularity and maintainability.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/homeassistant-extras/toolbar-status-chips/blob/master/src/config.ts'>config.ts</a></b></td>
				<td>- Generate chip configuration based on entity attributes<br>- The `createChipConfig` function creates a custom button card configuration for Home Assistant, incorporating entity-specific settings such as state, navigation path, and icon color<br>- It enables users to customize the appearance and behavior of the card, providing a tailored experience for each entity.</td>
			</tr>
			</table>
		</blockquote>
	</details>
	<details> <!-- .github Submodule -->
		<summary><b>.github</b></summary>
		<blockquote>
			<details>
				<summary><b>workflows</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/homeassistant-extras/toolbar-status-chips/blob/master/.github/workflows/push.yml'>push.yml</a></b></td>
						<td>- The provided YAML file orchestrates the deployment of new releases by automating version bumps, creating tags, and updating main branches with release changes<br>- It ensures that only authorized commits are allowed to trigger a release, while also handling automated version bumps and merge operations<br>- The workflow streamlines the release process, making it more efficient and reliable.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/homeassistant-extras/toolbar-status-chips/blob/master/.github/workflows/pull_request.yaml'>pull_request.yaml</a></b></td>
						<td>- The main purpose of the `pull_request.yaml` file is to automate a fast-forward check on pull requests<br>- It ensures that when a new merge commit is created, it's not a fast forward, which helps maintain the integrity of the repository's history<br>- This workflow checks if a fast forward is possible and posts a comment with the result, providing visibility into the repository's health.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/homeassistant-extras/toolbar-status-chips/blob/master/.github/workflows/merge.yaml'>merge.yaml</a></b></td>
						<td>- Merge workflow automates the fast-forward merge process for pull requests<br>- It checks for new issue comments containing the `/merge` command and triggers a job to perform the merge, utilizing a GitHub app token for authentication<br>- The workflow reduces verbosity by posting comments only on error or never<br>- This enables efficient and secure automated merging of pull requests in the project.</td>
					</tr>
					</table>
				</blockquote>
			</details>
		</blockquote>
	</details>
</details>

<!-- prettier-ignore-end -->

## License

By contributing, you agree that your contributions will be licensed under the project's license.

Thank you for contributing!

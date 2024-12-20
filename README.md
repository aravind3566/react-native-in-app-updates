# react-native-in-app-updates

**react-native-in-app-updates** is a lightweight and simple-to-use library for implementing Android in-app updates. Keep your app users up-to-date seamlessly with minimal effort.

## Features
- Lightweight and easy to integrate.
- Supports Android in-app update flows.
- Flexible update options for a tailored user experience.

## Installation

Install the package using npm:

```sh
npm install react-native-in-app-updates
```

## Usage

To check for updates, use the following example code:

```javascript
import { useEffect } from 'react';
import { checkForUpdate, UpdateFlow } from 'react-native-in-app-updates';

useEffect(() => {
  getData();
}, []);

async function getData() {
  try {
    await checkForUpdate(UpdateFlow.FLEXIBLE);
  } catch (e) {
    // Handle error
  }
}
```

### Update Flow Options

You can choose between two update flows:

- **Flexible:** Allows users to continue using the app while the update downloads.
  ```javascript
  await checkForUpdate(UpdateFlow.FLEXIBLE);
  ```

  ![alt text](https://developer.android.com/static/images/app-bundle/flexible_flow.png)

- **Immediate:** Forces users to update the app before they can continue using it.
  ```javascript
  await checkForUpdate(UpdateFlow.IMMEDIATE);
  ```

  ![alt text](https://developer.android.com/static/images/app-bundle/immediate_flow.png)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT


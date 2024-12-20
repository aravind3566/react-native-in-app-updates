import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { checkForUpdate, UpdateFlow } from 'react-native-in-app-updates';

export default function App() {
  const [updateAvailable, setUpdateAvailable] = useState('');

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const result = await checkForUpdate(UpdateFlow.FLEXIBLE);
      setUpdateAvailable(result);
    } catch (e) {}
  }

  return (
    <View>
      <Text>{updateAvailable}</Text>
    </View>
  );
}

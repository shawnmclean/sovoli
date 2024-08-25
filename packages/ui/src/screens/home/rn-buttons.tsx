import { View } from "react-native";
import { Button, ButtonText } from "../../components/button";
import { Text } from "../../components/text";
import React from "react";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "../../components/alert-dialog";

function RNButtons() {
  //add counter button press
  const [counter, setCounter] = React.useState(0);

  const handleCounter = () => {
    setCounter(counter + 1);
  };
  return (
    <View>
      <View className="flex-row">
        <Text>Counter is {counter}</Text>
        <Button className="m-2" onPress={handleCounter}>
          <ButtonText>Increase</ButtonText>
        </Button>
      </View>
      {/* <View className="flex-1 justify-center items-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">
              <Text>Show Alert Dialog</Text>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                <Text>Cancel</Text>
              </AlertDialogCancel>
              <AlertDialogAction>
                <Text>Continue</Text>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </View> */}
    </View>
  );
}

export default RNButtons;

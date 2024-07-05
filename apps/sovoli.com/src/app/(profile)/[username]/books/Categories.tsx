"use client";

import * as React from "react";
import { View } from "react-native";
import { Button } from "@sovoli/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@sovoli/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@sovoli/ui/components/tabs";
import { Text } from "@sovoli/ui/components/text";

export default function Categories() {
  const [value, setValue] = React.useState("lists");
  return (
    <View className="flex-1 justify-center p-6">
      <Tabs
        value={value}
        onValueChange={setValue}
        className="w-full max-w-[400px] mx-auto flex-col gap-1.5"
      >
        <TabsList className="flex-row w-full">
          <TabsTrigger value="lists" className="flex-1">
            <Text>Lists (3)</Text>
          </TabsTrigger>
          <TabsTrigger value="shelves" className="flex-1">
            <Text>Shelves (2)</Text>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="lists">
          <Card>
            <CardHeader></CardHeader>
            <CardContent className="gap-4 native:gap-2">
              <View className="flex items-center justify-between">
                <Text className="text-2xl font-bold">Lists (3)</Text>
                <View className="flex space-x-2">
                  <Button variant="outline">Sort</Button>
                  <Button className="ml-auto">Create Lists</Button>
                </View>
              </View>
              <View className="gap-1">Lists</View>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="shelves">
          <Card>
            <CardHeader>
              <CardTitle>Shelves (2)</CardTitle>
              <View className="flex space-x-2">
                <Button variant="outline">Sort</Button>
                <Button className="ml-auto">Create Shelves</Button>
              </View>
            </CardHeader>
            <CardContent className="gap-4 native:gap-2">
              <View className="gap-1">Shelves</View>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </View>
  );
}

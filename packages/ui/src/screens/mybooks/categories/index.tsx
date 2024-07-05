"use client";

import * as React from "react";
import { View } from "react-native";
import { Button } from "../../../components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/tabs";
import { Text } from "../../../components/text";

export default function Categories() {
  const [value, setValue] = React.useState("lists");
  return (
    <View className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs value={value} onValueChange={setValue}>
        <View className="flex items-center">
          <TabsList>
            <TabsTrigger value="lists">
              <Text>Lists (3)</Text>
            </TabsTrigger>
            <TabsTrigger value="shelves">
              <Text>Shelves (2)</Text>
            </TabsTrigger>
          </TabsList>
          <View className="ml-auto flex items-center gap-2">
            <Button variant="outline" className="h-8 gap-1">
              Sort
            </Button>
            {value === "lists" ? (
              <Button className="h-8 gap-1">Create Lists</Button>
            ) : (
              <Button className="h-8 gap-1">Create Shelves</Button>
            )}
          </View>
        </View>
        <TabsContent value="lists">
          <Card>
            <CardHeader>
              <CardTitle>Lists (2)</CardTitle>
              <CardDescription>
                Arbitrary list of books (e.g. favorites, to-read, categories,
                etc)
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-4 native:gap-2">
              <View className="gap-1">Lists</View>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="shelves">
          <Card>
            <CardHeader>
              <CardTitle>Shelves (2)</CardTitle>
              <CardDescription>Physical bookshelves</CardDescription>
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

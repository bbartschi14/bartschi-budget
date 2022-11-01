import { Center, Paper, Text } from "@mantine/core";
import React from "react";

type DateItemProps = {
  date: Date;
};

const DateItem = (props: DateItemProps) => {
  return (
    <Center>
      <Text align="center">{props.date.toDateString()}</Text>
    </Center>
  );
};

export default DateItem;

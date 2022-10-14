import {
  Card,
  Center,
  Paper,
  Text,
  Stack,
  Button,
  Group,
  Badge,
  MantineColor,
  useMantineTheme,
  ActionIcon,
} from "@mantine/core";
import React, { useState, useEffect } from "react";
import { IconEdit, IconTrash } from "@tabler/icons";

type CategoryCardProps = {
  category: CategoryType;
  setEditState: any;
};

const CategoryCard = (props: CategoryCardProps) => {
  const theme = useMantineTheme();

  const getCSSColor = (color: string) => {
    let splitColor = color.split(".");
    return color in theme.colors || splitColor[0] in theme.colors
      ? splitColor.length > 1 && splitColor[1] in theme.colors[splitColor[0]]
        ? theme.colors[splitColor[0]][splitColor[1]]
        : theme.colors[color]
      : color;
  };

  return (
    <Card
      style={{
        // backgroundColor: props.category.color,
        width: "300px",
      }}
      p="xl"
      shadow="sm"
      withBorder={true}
      sx={(theme) => {
        let color = getCSSColor(props.category.color);
        return {
          borderColor: color,
          borderWidth: "3px",
        };
      }}
    >
      <Stack>
        <Group position="apart">
          <Text weight={500} size="lg">
            {props.category.name}
          </Text>
          <Badge color={props.category.color}>{"Color"}</Badge>
        </Group>
        <Text>
          {props.category.monthlyBudget.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          }) + " / month"}
        </Text>
        <Group position="apart">
          <Button
            sx={() => ({ alignSelf: "flex-start" })}
            leftIcon={<IconEdit size={14} />}
            variant="light"
            onClick={() => {
              props.setEditState({ isEditing: true, category: props.category });
            }}
          >
            Edit
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};

export default CategoryCard;

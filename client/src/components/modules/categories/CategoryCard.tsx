import {
  Card,
  Text,
  Stack,
  Button,
  Group,
  Badge,
  useMantineTheme,
  ActionIcon,
  Code,
  Avatar,
  Tooltip,
} from "@mantine/core";
import React, { Dispatch, SetStateAction } from "react";
import { IconEdit, IconCalendar, IconTrash } from "@tabler/icons";

type CategoryCardProps = {
  category: CategoryType;
  setEditState: Dispatch<SetStateAction<CategoryEditState>>;
  setDeleteState: Dispatch<SetStateAction<CategoryDeleteState>>;
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
        width: "300px",
      }}
      p="xl"
      shadow="sm"
      withBorder={true}
      sx={(theme) => {
        let color = getCSSColor(props.category.color);
        return {
          overflow: "visible",
          borderColor: color,
          borderWidth: "3px",
        };
      }}
    >
      {/* Yearly Tag */}
      {props.category.type == "Yearly" && (
        <Tooltip color={"gray.6"} label="Yearly category">
          <Avatar
            variant="filled"
            color={"gray.6"}
            radius={"xl"}
            size={"md"}
            sx={(theme) => ({
              position: "absolute",
              right: "-10px",
              top: "-10px",
            })}
          >
            <IconCalendar size={20} />
          </Avatar>
        </Tooltip>
      )}

      <Stack>
        {/* Top Row (Name) */}
        <Group position="apart">
          <Text weight={500} size="lg">
            {props.category.name}
          </Text>
          <Badge color={props.category.color}>{"Color"}</Badge>
        </Group>

        {/* Middle Row (Money) */}
        <Group spacing={"xs"} align={"center"}>
          <Code
            sx={(theme) => ({
              fontSize: "18px",
              letterSpacing: "1px",
              backgroundColor: "white",
              padding: "0px",
            })}
          >
            {props.category.monthlyBudget.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </Code>
          <Text size={"xl"}>{"/"}</Text>
          <Text>{props.category.type == "Monthly" ? "month" : "year"}</Text>
        </Group>

        {/* Bottom Row (Actions) */}
        <Group position="apart">
          <Button
            sx={() => ({ alignSelf: "flex-start" })}
            leftIcon={<IconEdit size={14} />}
            variant="light"
            onClick={() => {
              props.setEditState({ state: "editing", category: props.category });
            }}
          >
            Edit
          </Button>
          <Tooltip label="Delete">
            <ActionIcon
              onClick={() => {
                props.setDeleteState({
                  isDeleting: true,
                  category: props.category,
                  sendToCategory: null,
                });
              }}
            >
              <IconTrash size={14} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Stack>
    </Card>
  );
};

export default CategoryCard;

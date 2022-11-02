import React from "react";
import { IconGitPullRequest, IconAlertCircle, IconChartDonut3 } from "@tabler/icons";
import { ThemeIcon, UnstyledButton, Group, Text } from "@mantine/core";

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  isSelected: boolean;
  setTab: any;
  index: number;
}

function MainLink({ icon, color, label, isSelected, setTab, index }: MainLinkProps) {
  return (
    <UnstyledButton
      onClick={() => setTab(index)}
      sx={(theme) => ({
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        backgroundColor: isSelected ? theme.colors.blue[0] : "",
        "&:hover": {
          backgroundColor: isSelected
            ? theme.colors.blue[1]
            : theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

const data = [
  { icon: <IconGitPullRequest size={16} />, color: "blue", label: "Transactions" },
  { icon: <IconAlertCircle size={16} />, color: "blue", label: "Budget" },
  { icon: <IconChartDonut3 size={16} />, color: "blue", label: "Graphs" },
];

export const MainLinks = (props) => {
  return (
    <Group spacing={"xs"}>
      {data.map((link, i) => (
        <MainLink
          index={i}
          {...link}
          key={link.label}
          isSelected={props.selectedTab == i}
          setTab={props.setTab}
        />
      ))}
    </Group>
  );
};

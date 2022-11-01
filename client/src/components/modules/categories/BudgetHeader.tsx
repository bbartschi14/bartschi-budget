import { Group, Text } from "@mantine/core";
import { useCategories } from "./CategoriesContext";

const BudgetHeader = () => {
  const { budgetTotalPerType } = useCategories();

  return (
    <>
      <Group>
        <Text size={"lg"} weight={"bold"}>
          {"Monthly Budget :"}
        </Text>
        <Text size={"lg"} weight={"normal"}>
          {budgetTotalPerType.get("Monthly")?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </Text>
      </Group>
      <Group>
        <Text size={"lg"} weight={"bold"}>
          {"Yearly Items Budget :"}
        </Text>
        <Text size={"lg"} weight={"normal"}>
          {budgetTotalPerType.get("Yearly")?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </Text>
      </Group>
    </>
  );
};

export default BudgetHeader;

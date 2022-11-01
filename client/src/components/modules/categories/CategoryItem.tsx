import { Badge, Center } from "@mantine/core";

type CategoryItemProps = {
  category: CategoryType;
};

const CategoryItem = (props: CategoryItemProps) => {
  return (
    <Center>
      <Badge
        color={props.category.color}
        size="md"
        styles={{ root: { boxShadow: "#CCCCCC 1px 1px 2px" } }}
        variant="light"
      >
        {props.category.name}
      </Badge>
    </Center>
  );
};

export default CategoryItem;

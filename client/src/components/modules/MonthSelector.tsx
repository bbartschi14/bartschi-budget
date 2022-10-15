import { ActionIcon, Group, Text, Button } from "@mantine/core";
import React, { useState, useEffect } from "react";
import { getMonthsNames, Month } from "@mantine/dates";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import dayjs from "dayjs";

type MonthSelectorProps = {
  value: MonthSelectorState;
  setValue: any;
  categoryType: any;
  setCategoryType: any;
};

const monthNames = getMonthsNames("en", "MMMM");

const MonthSelector = (props: MonthSelectorProps) => {
  const [currentDate, setCurrentDate] = useState(dayjs());

  useEffect(() => {
    let newDate = new Date(props.value.year, props.value.month);
    setCurrentDate(dayjs(newDate));
  }, [props.value]);

  const increaseMonth = () => {
    let nextMonth = currentDate.add(1, props.categoryType == "Monthly" ? "month" : "year");
    props.setValue({ month: nextMonth.month(), year: nextMonth.year() });
  };

  const decreaseMonth = () => {
    let prevMonth = currentDate.add(-1, props.categoryType == "Monthly" ? "month" : "year");
    props.setValue({ month: prevMonth.month(), year: prevMonth.year() });
  };

  return (
    <Group>
      <ActionIcon variant="light" onClick={decreaseMonth}>
        <IconChevronLeft size={14} />
      </ActionIcon>
      <Button
        color={"gray"}
        variant="light"
        onClick={() =>
          props.setCategoryType(props.categoryType == "Monthly" ? "Yearly" : "Monthly")
        }
      >
        <Text size={"md"} weight={"600"} color={"dark.5"}>
          {props.categoryType == "Monthly"
            ? monthNames[currentDate.month()] + " " + currentDate.year()
            : currentDate.year()}
        </Text>
      </Button>
      <ActionIcon variant="light" onClick={increaseMonth}>
        <IconChevronRight size={14} />
      </ActionIcon>
    </Group>
  );
};

export default MonthSelector;

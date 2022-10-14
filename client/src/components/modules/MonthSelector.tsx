import { ActionIcon, Group, Text } from "@mantine/core";
import React, { useState, useEffect } from "react";
import { getMonthsNames, Month } from "@mantine/dates";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import dayjs from "dayjs";

type MonthSelectorProps = {
  value: MonthSelectorState;
  setValue: any;
};

const monthNames = getMonthsNames("en", "MMMM");

const MonthSelector = (props: MonthSelectorProps) => {
  const [currentDate, setCurrentDate] = useState(dayjs());

  useEffect(() => {
    let newDate = new Date(props.value.year, props.value.month);
    setCurrentDate(dayjs(newDate));
  }, [props.value]);

  const increaseMonth = () => {
    let nextMonth = currentDate.add(1, "month");
    props.setValue({ month: nextMonth.month(), year: nextMonth.year() });
  };

  const decreaseMonth = () => {
    let prevMonth = currentDate.add(-1, "month");
    props.setValue({ month: prevMonth.month(), year: prevMonth.year() });
  };

  return (
    <Group>
      <ActionIcon variant="light" onClick={decreaseMonth}>
        <IconChevronLeft size={14} />
      </ActionIcon>
      <Text size={"md"} weight={"600"}>
        {monthNames[currentDate.month()] + " " + currentDate.year()}
      </Text>
      <ActionIcon variant="light" onClick={increaseMonth}>
        <IconChevronRight size={14} />
      </ActionIcon>
    </Group>
  );
};

export default MonthSelector;

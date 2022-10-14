type CategoryType = {
  uuid: string;
  name: string;
  color: string;
  monthlyBudget: number;
};

type TransactionType = {
  _id?: string;
  uuid: string;
  name: string;
  category: string; //uuid
  amount: number;
  date: Date;
};

type MonthSelectorState = {
  month: number; // 0 - 11
  year: number;
};

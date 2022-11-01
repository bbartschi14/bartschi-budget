type CategoryType = {
  uuid?: string;
  name: string;
  color: string;
  monthlyBudget: number;
  type: string; // "Monthly" "Yearly"
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

type CategoryEditState = {
  state: "closed" | "adding" | "editing";
  category: CategoryType;
};
type CategoryDeleteState = {
  isDeleting: boolean;
  category: CategoryType;
  sendToCategory: CategoryType;
};

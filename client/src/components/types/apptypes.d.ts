type CategoryType = {
  uuid?: string;
  name: string;
  color: string;
  monthlyBudget: number;
  type: string; // "Monthly" "Yearly"
};

type TransactionType = {
  uuid?: string;
  user?: string; // person who submitted this transaction
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

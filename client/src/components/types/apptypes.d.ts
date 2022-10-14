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
  category: string;
  amount: number;
  date: Date;
};

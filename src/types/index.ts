export type Trip = {
  id: string;
  name: string;
  description: string;
  currency: string;
  budget: number;
  amount_used: number;
  start_trip?: Date;
  end_trip?: Date;
  createdAt: Date;
  emoji: string;
  background: string;
};

export type Expense = {
  id: string;
  date_issued: string;
  amount: number;
  type: string;
  payment_method: string;
  description: string;
};

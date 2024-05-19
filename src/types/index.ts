export type TripType = {
  id: number;
  name: string;
  description: string;
  currency: string;
  budget: number;
  amount_used: number;
  start_trip?: Date;
  end_trip?: Date;
  createdAt: Date;
};

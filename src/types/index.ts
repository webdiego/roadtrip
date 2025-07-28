export type TripType = {
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

export interface Campaign {
  id: string;
  name: string;
  pricePerProspect: number;
  pricePerLead?: number;
  dateCreated: string;
  isActive: boolean;
  description?: string;
  totalLeads?: number;
  totalProspects?: number;
  type: 'purchase' | 'sales';
}
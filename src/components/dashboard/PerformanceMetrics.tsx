import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { Prospect } from '../../types/prospect';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, DollarSign } from 'lucide-react';

registerLocale('fr', fr);

interface PerformanceMetricsProps {
  prospects: Prospect[];
}

type DateRange = 'week' | 'month' | 'custom';

export function PerformanceMetrics({ prospects }: PerformanceMetricsProps) {
  const now = new Date();
  const defaultStartDate = startOfWeek(now, { locale: fr });
  const defaultEndDate = endOfWeek(now, { locale: fr });

  const [dateRange, setDateRange] = useState<DateRange>('week');
  const [startDate, setStartDate] = useState<Date>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date>(defaultEndDate);

  const { filteredProspects, dateLabel } = useMemo(() => {
    let start: Date;
    let end: Date;
    let label: string;

    switch (dateRange) {
      case 'week':
        start = startOfWeek(now, { locale: fr });
        end = endOfWeek(now, { locale: fr });
        label = 'Cette semaine';
        break;
      case 'month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        label = 'Ce mois';
        break;
      case 'custom':
        start = startDate;
        end = endDate;
        label = `Du ${format(start, 'dd/MM/yyyy', { locale: fr })} au ${format(end, 'dd/MM/yyyy', { locale: fr })}`;
        break;
      default:
        start = defaultStartDate;
        end = defaultEndDate;
        label = 'Cette semaine';
    }

    const filtered = prospects.filter(p => {
      const date = new Date(p.dateCreation);
      return isWithinInterval(date, { start, end });
    });

    return { filteredProspects: filtered, dateLabel: label };
  }, [prospects, dateRange, startDate, endDate, now, defaultStartDate, defaultEndDate]);

  const metrics = useMemo(() => {
    const leads = filteredProspects.filter(p => p.status === 'LEADS');
    const soldLeads = filteredProspects.filter(p => p.status === 'VENDU' && p.leadPrice);
    
    const revenue = soldLeads.reduce((sum, p) => sum + (p.leadPrice || 0), 0);
    const cost = filteredProspects.reduce((sum, p) => sum + (p.prospectPrice || 0), 0);
    const profit = revenue - cost;
    
    const conversion = filteredProspects.length > 0
      ? (leads.length / filteredProspects.length) * 100
      : 0;
    
    const averageLeadPrice = soldLeads.length > 0 ? revenue / soldLeads.length : 0;
    const roi = cost > 0 ? (profit / cost) * 100 : 0;

    return {
      leads: leads.length,
      soldLeads: soldLeads.length,
      revenue,
      cost,
      profit,
      conversion,
      averageLeadPrice,
      roi
    };
  }, [filteredProspects]);

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    if (range === 'week') {
      setStartDate(startOfWeek(now, { locale: fr }));
      setEndDate(endOfWeek(now, { locale: fr }));
    } else if (range === 'month') {
      setStartDate(startOfMonth(now));
      setEndDate(endOfMonth(now));
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold">Performance commerciale</h3>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value as DateRange)}
            className="text-sm border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="custom">Période personnalisée</option>
          </select>

          {dateRange === 'custom' && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  locale="fr"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Date début"
                  className="text-sm border rounded-lg px-3 py-1.5 pl-8 w-36 focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none"
                />
                <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  locale="fr"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Date fin"
                  className="text-sm border rounded-lg px-3 py-1.5 pl-8 w-36 focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none"
                />
                <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm font-medium text-gray-500">Chiffre d'affaires ({dateLabel})</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-emerald-600">{metrics.revenue.toFixed(0)}€</span>
              <span className="text-sm text-gray-500 ml-2">
                {metrics.averageLeadPrice > 0 && `${metrics.averageLeadPrice.toFixed(0)}€/lead`}
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm font-medium text-gray-500">Coût total ({dateLabel})</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-red-600">{metrics.cost.toFixed(0)}€</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-red-500 to-red-600"
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm font-medium text-gray-500">Bénéfice</span>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold" style={{ color: metrics.profit >= 0 ? '#059669' : '#DC2626' }}>
                {metrics.profit.toFixed(0)}€
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-500">ROI</span>
          <span className="font-medium" style={{ color: metrics.roi >= 0 ? '#059669' : '#DC2626' }}>
            {metrics.roi.toFixed(1)}%
          </span>
        </div>
      </div>
    </Card>
  );
}
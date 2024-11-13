import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { ReactNode } from 'react';

type AnalyticsCardProps = {
  title: string;
  icon: ReactNode;
  value: string | number;
  valueDescription: string;
};

export default function AnalyticsCard({
  title,
  icon,
  value,
  valueDescription,
}: AnalyticsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{valueDescription}</p>
      </CardContent>
    </Card>
  );
}

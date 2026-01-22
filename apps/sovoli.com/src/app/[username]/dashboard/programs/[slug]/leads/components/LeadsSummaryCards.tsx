import { Card, CardBody } from "@sovoli/ui/components/card";

export interface LeadsSummaryStats {
  strong: number;
  uncertain: number;
  lowIntent: number;
  noVisibility: number;
}

export function LeadsSummaryCards({ stats }: { stats: LeadsSummaryStats }) {
  return (
    <div className="w-full overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 scrollbar-hide">
      <div className="flex gap-3 sm:grid sm:grid-cols-4 sm:gap-4 min-w-max sm:min-w-0">
        <Card className="min-w-[140px] flex-1 snap-start">
          <CardBody className="text-center p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl font-bold text-success">
              {stats.strong}
            </div>
            <div className="text-[10px] sm:text-xs font-medium text-default-500 uppercase tracking-wider mt-1">
              Strong
            </div>
          </CardBody>
        </Card>
        <Card className="min-w-[140px] flex-1 snap-start">
          <CardBody className="text-center p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl font-bold text-warning">
              {stats.uncertain}
            </div>
            <div className="text-[10px] sm:text-xs font-medium text-default-500 uppercase tracking-wider mt-1">
              Uncertain
            </div>
          </CardBody>
        </Card>
        <Card className="min-w-[140px] flex-1 snap-start">
          <CardBody className="text-center p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl font-bold text-default-600">
              {stats.lowIntent}
            </div>
            <div className="text-[10px] sm:text-xs font-medium text-default-500 uppercase tracking-wider mt-1">
              Low Intent
            </div>
          </CardBody>
        </Card>
        <Card className="min-w-[140px] flex-1 snap-start">
          <CardBody className="text-center p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl font-bold text-danger">
              {stats.noVisibility}
            </div>
            <div className="text-[10px] sm:text-xs font-medium text-default-500 uppercase tracking-wider mt-1">
              No Visibility
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

import { Card, CardBody } from "@sovoli/ui/components/card";

export interface LeadsSummaryStats {
    strong: number;
    uncertain: number;
    lowIntent: number;
    noVisibility: number;
}

export function LeadsSummaryCards({ stats }: { stats: LeadsSummaryStats }) {
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card>
                <CardBody className="text-center p-4">
                    <div className="text-2xl font-bold text-success">
                        {stats.strong}
                    </div>
                    <div className="text-xs text-default-500">
                        🟢 Strong / Wants to Proceed
                    </div>
                </CardBody>
            </Card>
            <Card>
                <CardBody className="text-center p-4">
                    <div className="text-2xl font-bold text-warning">
                        {stats.uncertain}
                    </div>
                    <div className="text-xs text-default-500">
                        🟡 Uncertain / Needs clarity
                    </div>
                </CardBody>
            </Card>
            <Card>
                <CardBody className="text-center p-4">
                    <div className="text-2xl font-bold text-default-600">
                        {stats.lowIntent}
                    </div>
                    <div className="text-xs text-default-500">⚪ Low intent</div>
                </CardBody>
            </Card>
            <Card>
                <CardBody className="text-center p-4">
                    <div className="text-2xl font-bold text-danger">
                        {stats.noVisibility}
                    </div>
                    <div className="text-xs text-default-500">🔴 No visibility</div>
                </CardBody>
            </Card>
        </div>
    );
}

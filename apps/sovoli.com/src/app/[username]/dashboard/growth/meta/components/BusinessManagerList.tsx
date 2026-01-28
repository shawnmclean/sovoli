"use client";

import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";

interface BusinessManager {
    id: string;
    name: string;
    primary_page?: { id: string; name: string };
    verification_status?: string;
}

interface BusinessManagerListProps {
    businesses: BusinessManager[];
    onSelect: (id: string) => void;
    isLoading: boolean;
}

export function BusinessManagerList({ businesses, onSelect, isLoading }: BusinessManagerListProps) {
    if (businesses.length === 0 && !isLoading) {
        return (
            <Card>
                <CardBody className="pt-6">
                    <p className="text-center text-muted-foreground">No Business Managers found for this account.</p>
                </CardBody>
            </Card>
        );
    }

    return (
        <div className="grid gap-4">
            <h2 className="text-lg font-semibold">Select Business Manager</h2>
            {businesses.map((bm) => (
                <Card key={bm.id} isPressable className="cursor-pointer hover:border-primary transition-colors" onPress={() => onSelect(bm.id)}>
                    <CardHeader className="flex flex-col items-start p-4">
                        <h3 className="text-md font-bold">{bm.name}</h3>
                        <p className="text-sm text-muted-foreground">ID: {bm.id}</p>
                    </CardHeader>
                    <CardBody className="p-4 pt-0">
                        {bm.verification_status && (
                            <span className="text-xs bg-secondary px-2 py-1 rounded-full capitalize">
                                {bm.verification_status.replace(/_/g, " ")}
                            </span>
                        )}
                        {bm.primary_page && (
                            <p className="mt-2 text-xs text-muted-foreground">
                                Primary Page: {bm.primary_page.name}
                            </p>
                        )}
                    </CardBody>
                </Card>
            ))}
            {isLoading && (
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <div className="h-24 bg-muted rounded-md" />
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

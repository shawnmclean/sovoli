"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Button } from "@sovoli/ui/components/button";
import { Checkbox } from "@sovoli/ui/components/checkbox";
import { Badge } from "@sovoli/ui/components/badge";
import { Input } from "@sovoli/ui/components/input";
import { Select, SelectItem } from "@sovoli/ui/components/select";
import { Plus } from "lucide-react";

interface MetaPage {
    id: string;
    name: string;
}

interface MetaAdAccount {
    id: string;
    name: string;
    account_id: string;
    currency: string;
}

interface AssetSelectorProps {
    pages: MetaPage[];
    adAccounts: MetaAdAccount[];
    onConfirm: (selection: { pageIds: string[]; adAccountIds: string[]; newAdAccount?: { name: string; currency: string; timezoneId: number } }) => void;
    isLoading: boolean;
}

const COMMON_CURRENCIES = [
    { label: "US Dollar (USD)", value: "USD" },
    { label: "Brazilian Real (BRL)", value: "BRL" },
    { label: "Euro (EUR)", value: "EUR" },
    { label: "Guyanese Dollar (GYD)", value: "GYD" },
];

const COMMON_TIMEZONES = [
    { label: "America/New_York (1)", value: 1 },
    { label: "America/Sao_Paulo (14)", value: 14 },
    { label: "America/Guyana (15)", value: 15 },
    { label: "UTC (16)", value: 16 },
];

export function AssetSelector({ pages, adAccounts, onConfirm, isLoading }: AssetSelectorProps) {
    const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);
    const [selectedAdAccountIds, setSelectedAdAccountIds] = useState<string[]>([]);
    const [isCreatingAdAccount, setIsCreatingAdAccount] = useState(false);
    const [newAdAccount, setNewAdAccount] = useState({ name: "", currency: "USD", timezoneId: 1 });

    const handleConfirm = () => {
        onConfirm({
            pageIds: selectedPageIds,
            adAccountIds: selectedAdAccountIds,
            newAdAccount: isCreatingAdAccount ? newAdAccount : undefined,
        });
    };

    const togglePage = (id: string) => {
        setSelectedPageIds(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const toggleAdAccount = (id: string) => {
        setSelectedAdAccountIds(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-col items-start gap-1">
                        <h3 className="text-lg font-bold">1. Select Pages</h3>
                        <p className="text-sm text-muted-foreground">Choose the pages the system user should manage.</p>
                    </CardHeader>
                    <CardBody className="max-h-80 overflow-y-auto space-y-2">
                        {pages.length > 0 ? (
                            pages.map((page) => (
                                <div key={page.id} className="flex items-center gap-3 p-2 hover:bg-default-100 rounded-md transition-colors">
                                    <Checkbox
                                        isSelected={selectedPageIds.includes(page.id)}
                                        onValueChange={() => togglePage(page.id)}
                                    />
                                    <div>
                                        <p className="text-sm font-medium">{page.name}</p>
                                        <p className="text-xs text-muted-foreground">ID: {page.id}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground py-4 text-center">No pages owned by this BM.</p>
                        )}
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader className="flex flex-col items-start gap-1">
                        <h3 className="text-lg font-bold">2. Select Ad Accounts</h3>
                        <p className="text-sm text-muted-foreground">Choose existing or create a new ad account.</p>
                    </CardHeader>
                    <CardBody className="max-h-80 overflow-y-auto space-y-2">
                        {adAccounts.length > 0 ? (
                            adAccounts.map((account) => (
                                <div key={account.id} className="flex items-center gap-3 p-2 hover:bg-default-100 rounded-md transition-colors">
                                    <Checkbox
                                        isSelected={selectedAdAccountIds.includes(account.id)}
                                        onValueChange={() => toggleAdAccount(account.id)}
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-medium">{account.name}</p>
                                            <Badge size="sm" variant="flat">{account.currency}</Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">ID: {account.id}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            !isCreatingAdAccount && <p className="text-sm text-muted-foreground py-4 text-center">No ad accounts found.</p>
                        )}

                        <Button
                            variant="light"
                            color={isCreatingAdAccount ? "danger" : "primary"}
                            startContent={isCreatingAdAccount ? null : <Plus className="h-4 w-4" />}
                            className="w-full mt-2"
                            onClick={() => setIsCreatingAdAccount(!isCreatingAdAccount)}
                        >
                            {isCreatingAdAccount ? "Cancel New Account" : "Create New Ad Account"}
                        </Button>

                        {isCreatingAdAccount && (
                            <div className="p-4 border-2 border-primary/20 rounded-lg space-y-4 mt-2 bg-primary/5">
                                <Input
                                    label="Account Name"
                                    placeholder="e.g. My Business Ads"
                                    value={newAdAccount.name}
                                    onValueChange={(val) => setNewAdAccount(prev => ({ ...prev, name: val }))}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Select
                                        label="Currency"
                                        selectedKeys={[newAdAccount.currency]}
                                        onSelectionChange={(keys) => setNewAdAccount(prev => ({ ...prev, currency: Array.from(keys)[0] as string }))}
                                    >
                                        {COMMON_CURRENCIES.map((c) => (
                                            <SelectItem key={c.value} textValue={c.label}>{c.label}</SelectItem>
                                        ))}
                                    </Select>
                                    <Select
                                        label="Timezone"
                                        selectedKeys={[newAdAccount.timezoneId.toString()]}
                                        onSelectionChange={(keys) => setNewAdAccount(prev => ({ ...prev, timezoneId: parseInt(Array.from(keys)[0] as string) }))}
                                    >
                                        {COMMON_TIMEZONES.map((t) => (
                                            <SelectItem key={t.value.toString()} textValue={t.label}>{t.label}</SelectItem>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button
                    color="primary"
                    size="lg"
                    isLoading={isLoading}
                    onClick={handleConfirm}
                    disabled={selectedPageIds.length === 0 && selectedAdAccountIds.length === 0 && !isCreatingAdAccount}
                >
                    Confirm Selection & Setup
                </Button>
            </div>
        </div>
    );
}

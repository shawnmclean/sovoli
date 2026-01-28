"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Badge } from "@sovoli/ui/components/badge";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
import { Select, SelectItem } from "@sovoli/ui/components/select";
import { Check, Copy, Plus, X } from "lucide-react";
import { createMetaAdAccount } from "../actions";

interface MetaPage {
    id: string;
    name: string;
    access_token?: string;
}

interface MetaAdAccount {
    id: string;
    name: string;
    account_id: string;
    currency: string;
}

interface AssetDisplayProps {
    systemUser: {
        id: string;
        token: string;
        name?: string;
    };
    businessId: string;
    pages: MetaPage[];
    adAccounts: MetaAdAccount[];
    onRefresh?: () => void;
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

export function AssetDisplay({ systemUser, businessId, pages, adAccounts, onRefresh }: AssetDisplayProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [newAccount, setNewAccount] = useState({ name: "", currency: "USD", timezoneId: 1 });
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async () => {
        setIsLoading(true);
        const result = await createMetaAdAccount({
            businessId,
            accessToken: systemUser.token,
            assignToUserId: systemUser.id, // Assign to this system user
            ...newAccount
        });
        if (result.status === "success") {
            setIsCreating(false);
            setNewAccount({ name: "", currency: "USD", timezoneId: 1 });
            onRefresh?.();
        } else {
            alert(result.message);
        }
        setIsLoading(false);
    };

    const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text);
    };

    const maskToken = (token: string) => {
        if (!token) return "";
        return `${token.substring(0, 8)}...${token.substring(token.length - 4)}`;
    };
    return (
        <div className="space-y-6">
            <Card className="border-success/30 bg-success/5">
                <CardHeader className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-success" />
                    <h3 className="text-lg font-semibold text-success">Meta Business Connected</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-secondary">System User</h4>
                                <Button
                                    size="sm"
                                    variant="light"
                                    isIconOnly
                                    className="h-6 w-6 min-w-0"
                                    onClick={() => {
                                        void copyToClipboard(systemUser.id);
                                    }}
                                >
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                            <p className="text-sm font-mono bg-default-50 p-2 rounded border border-default-200 mt-1 select-all text-ellipsis overflow-hidden">
                                ID: {systemUser.id} {systemUser.name ? `(${systemUser.name})` : ""}
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-secondary">Business ID</h4>
                                <Button
                                    size="sm"
                                    variant="light"
                                    isIconOnly
                                    className="h-6 w-6 min-w-0"
                                    onClick={() => {
                                        void copyToClipboard(businessId);
                                    }}
                                >
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                            <p className="text-sm font-mono bg-default-50 p-2 rounded border border-default-200 mt-1 select-all">
                                {businessId}
                            </p>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-secondary">System User Token</h4>
                            <Button
                                size="sm"
                                variant="light"
                                isIconOnly
                                className="h-6 w-6 min-w-0"
                                onClick={() => {
                                    void copyToClipboard(systemUser.token);
                                }}
                            >
                                <Copy className="h-3 w-3" />
                            </Button>
                        </div>
                        <p className="text-xs font-mono bg-default-50 p-2 rounded border border-default-200 mt-1 break-all select-all">
                            {maskToken(systemUser.token)}
                        </p>
                    </div>
                </CardBody>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <h3 className="text-md font-semibold font-semibold">Pages</h3>
                        <Badge variant="flat" color="secondary">{pages.length}</Badge>
                    </CardHeader>
                    <CardBody className="max-h-60 overflow-y-auto">
                        {pages.length > 0 ? (
                            <ul className="space-y-3">
                                {pages.map((page) => (
                                    <li key={page.id} className="text-sm border-b pb-2 last:border-0">
                                        <p className="font-semibold">{page.name}</p>
                                        <p className="text-xs text-muted-foreground">ID: {page.id}</p>
                                        {page.access_token && (
                                            <p className="text-[10px] font-mono mt-1 text-muted-foreground truncate">
                                                Token: {page.access_token}
                                            </p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">No pages found.</p>
                        )}
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h3 className="text-md font-semibold">Ad Accounts</h3>
                            <Badge variant="flat" color="secondary">{adAccounts.length}</Badge>
                        </div>
                        <Button
                            size="sm"
                            variant="flat"
                            color={isCreating ? "danger" : "primary"}
                            startContent={isCreating ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            onClick={() => setIsCreating(!isCreating)}
                        >
                            {isCreating ? "Cancel" : "Add More"}
                        </Button>
                    </CardHeader>
                    <CardBody className="max-h-80 overflow-y-auto">
                        {isCreating && (
                            <div className="p-4 border-2 border-primary/20 rounded-lg space-y-4 mb-4 bg-primary/5">
                                <Input
                                    label="Account Name"
                                    size="sm"
                                    value={newAccount.name}
                                    onValueChange={(val) => setNewAccount(prev => ({ ...prev, name: val }))}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <Select
                                        label="Currency"
                                        size="sm"
                                        selectedKeys={[newAccount.currency]}
                                        onSelectionChange={(keys) => setNewAccount(prev => ({ ...prev, currency: Array.from(keys)[0] as string }))}
                                    >
                                        {COMMON_CURRENCIES.map((c) => (
                                            <SelectItem key={c.value} textValue={c.label}>{c.label}</SelectItem>
                                        ))}
                                    </Select>
                                    <Select
                                        label="Timezone"
                                        size="sm"
                                        selectedKeys={[newAccount.timezoneId.toString()]}
                                        onSelectionChange={(keys) => setNewAccount(prev => ({ ...prev, timezoneId: parseInt(Array.from(keys)[0] as string) }))}
                                    >
                                        {COMMON_TIMEZONES.map((t) => (
                                            <SelectItem key={t.value.toString()} textValue={t.label}>{t.label}</SelectItem>
                                        ))}
                                    </Select>
                                </div>
                                <Button
                                    color="primary"
                                    size="sm"
                                    className="w-full"
                                    isLoading={isLoading}
                                    disabled={!newAccount.name}
                                    onClick={handleCreate}
                                >
                                    Create Account
                                </Button>
                            </div>
                        )}
                        {adAccounts.length > 0 ? (
                            <ul className="space-y-3">
                                {adAccounts.map((account) => (
                                    <li key={account.id} className="text-sm border-b pb-2 last:border-0">
                                        <p className="font-semibold">{account.name}</p>
                                        <p className="text-xs text-muted-foreground">ID: {account.id}</p>
                                        <div className="flex gap-2 mt-1">
                                            <Badge variant="flat" color="primary" className="text-[10px]">
                                                {account.currency}
                                            </Badge>
                                            <Badge variant="flat" color="primary" className="text-[10px]">
                                                {account.account_id}
                                            </Badge>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">No ad accounts found.</p>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

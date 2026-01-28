"use client";

import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Badge } from "@sovoli/ui/components/badge";
import { Check, FileIcon } from "lucide-react";

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
    pages: MetaPage[];
    adAccounts: MetaAdAccount[];
}

export function AssetDisplay({ systemUser, pages, adAccounts }: AssetDisplayProps) {
    return (
        <div className="space-y-6">
            <Card className="border-green-200 bg-green-50/50">
                <CardHeader className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-700" />
                    <h3 className="text-lg font-semibold text-green-700">Meta Business Connected</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                    <div>
                        <h4 className="text-sm font-semibold text-green-800">System User</h4>
                        <p className="text-sm font-mono bg-white p-2 rounded border mt-1 select-all">
                            ID: {systemUser.id} {systemUser.name ? `(${systemUser.name})` : ""}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-green-800">System User Token</h4>
                        <p className="text-xs font-mono bg-white p-2 rounded border mt-1 break-all select-all">
                            {systemUser.token}
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
                        <h3 className="text-md font-semibold font-semibold">Ad Accounts</h3>
                        <Badge variant="flat" color="secondary">{adAccounts.length}</Badge>
                    </CardHeader>
                    <CardBody className="max-h-60 overflow-y-auto">
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

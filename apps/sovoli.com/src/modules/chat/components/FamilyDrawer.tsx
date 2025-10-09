"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
import { Badge } from "@sovoli/ui/components/badge";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { EllipsisIcon, UsersIcon } from "lucide-react";

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age?: number;
  notes?: string;
}

interface FamilyDrawerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  familyMembers: FamilyMember[];
  onFamilyMembersChange: (members: FamilyMember[]) => void;
}

export function FamilyDrawer({
  isOpen,
  onOpenChange,
  familyMembers,
  onFamilyMembersChange,
}: FamilyDrawerProps) {
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    age: "",
    notes: "",
  });

  const handleAddMember = () => {
    if (!formData.name.trim() || !formData.relationship.trim()) return;

    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      relationship: formData.relationship.trim(),
      age: formData.age ? parseInt(formData.age) : undefined,
      notes: formData.notes.trim() || undefined,
    };

    onFamilyMembersChange([...familyMembers, newMember]);
    setFormData({ name: "", relationship: "", age: "", notes: "" });
  };

  const handleEditMember = (member: FamilyMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      relationship: member.relationship,
      age: member.age?.toString() ?? "",
      notes: member.notes ?? "",
    });
  };

  const handleUpdateMember = () => {
    if (
      !editingMember ||
      !formData.name.trim() ||
      !formData.relationship.trim()
    )
      return;

    const updatedMember: FamilyMember = {
      ...editingMember,
      name: formData.name.trim(),
      relationship: formData.relationship.trim(),
      age: formData.age ? parseInt(formData.age) : undefined,
      notes: formData.notes.trim() || undefined,
    };

    onFamilyMembersChange(
      familyMembers.map((member) =>
        member.id === editingMember.id ? updatedMember : member,
      ),
    );
    setEditingMember(null);
    setFormData({ name: "", relationship: "", age: "", notes: "" });
  };

  const handleDeleteMember = (id: string) => {
    onFamilyMembersChange(familyMembers.filter((member) => member.id !== id));
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
    setFormData({ name: "", relationship: "", age: "", notes: "" });
  };

  return (
    <Drawer
      hideCloseButton
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="bottom"
      size="lg"
      backdrop="opaque"
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader
              showBackButton
              onBackPress={onClose}
              startContent={
                <div className="flex items-center gap-3 ml-2">
                  <UsersIcon className="w-5 h-5 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      Family Members
                    </span>
                    <span className="text-xs text-default-500">
                      Manage your family information
                    </span>
                  </div>
                </div>
              }
            />

            <DrawerBody className="p-4">
              <div className="space-y-4">
                {/* Add/Edit Form */}
                <div className="bg-default-50 rounded-lg p-4 space-y-3">
                  <h3 className="text-sm font-medium text-foreground">
                    {editingMember ? "Edit Family Member" : "Add Family Member"}
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      size="lg"
                    />
                    <Input
                      placeholder="Relationship (e.g., Child, Spouse)"
                      value={formData.relationship}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          relationship: e.target.value,
                        })
                      }
                      size="lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Age (optional)"
                      type="number"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                      size="lg"
                    />
                    <Input
                      placeholder="Notes (optional)"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      size="lg"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      color="primary"
                      onPress={
                        editingMember ? handleUpdateMember : handleAddMember
                      }
                      isDisabled={
                        !formData.name.trim() || !formData.relationship.trim()
                      }
                    >
                      {editingMember ? "Update" : "Add"} Member
                    </Button>
                    {editingMember && (
                      <Button
                        size="sm"
                        variant="bordered"
                        onPress={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>

                {/* Family Members List */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground">
                    Family Members ({familyMembers.length})
                  </h3>

                  {familyMembers.length === 0 ? (
                    <div className="text-center py-8 text-default-500">
                      <UsersIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No family members added yet</p>
                      <p className="text-xs">
                        Add your first family member above
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {familyMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 bg-default-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">
                                {member.name}
                              </span>
                              <Badge size="sm" variant="flat" color="primary">
                                {member.relationship}
                              </Badge>
                              {member.age && (
                                <span className="text-xs text-default-500">
                                  Age {member.age}
                                </span>
                              )}
                            </div>
                            {member.notes && (
                              <p className="text-xs text-default-500 mt-1">
                                {member.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="light"
                              isIconOnly
                              onPress={() => handleEditMember(member)}
                            >
                              <EllipsisIcon className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="light"
                              color="danger"
                              isIconOnly
                              onPress={() => handleDeleteMember(member.id)}
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}

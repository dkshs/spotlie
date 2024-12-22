"use client";

import { UserButton as ClerkUserButton } from "@clerk/nextjs";
import { User } from "@phosphor-icons/react";

type UserButtonProps = {
  readonly externalId: string | null;
  readonly isArtist?: boolean;
};

export function UserButton({ externalId, isArtist = false }: UserButtonProps) {
  return (
    <ClerkUserButton userProfileMode="modal">
      {externalId ? (
        <ClerkUserButton.MenuItems>
          <ClerkUserButton.Link
            labelIcon={<User size={18} />}
            label="Profile"
            href={`/${isArtist ? "artist" : "user"}/${externalId}`}
          >
            Canal
          </ClerkUserButton.Link>
        </ClerkUserButton.MenuItems>
      ) : null}
    </ClerkUserButton>
  );
}

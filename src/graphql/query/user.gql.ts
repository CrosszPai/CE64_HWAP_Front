import { gql } from '@urql/core';
import type { TypedDocumentNode } from '@urql/core';
import type { User } from 'src/global';

export const USER: TypedDocumentNode<{ user: User }> = gql`
	query user {
		user {
			id
			name
            email
            role
            avatar_url
		}
	}
`;

export const USERS: TypedDocumentNode<{ users: User[] }> = gql`
	query users {
		users {
			id
			name
            email
            role
            avatar_url
		}
	}
`;

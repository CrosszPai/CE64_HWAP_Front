import { gql, TypedDocumentNode } from '@urql/svelte';
import type { User } from 'src/global';

export const USER: TypedDocumentNode<{ user: User[] }> = gql`
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

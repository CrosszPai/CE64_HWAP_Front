import { gql, TypedDocumentNode } from '@urql/svelte';
import type { Repo } from 'src/global';

export const REPOS: TypedDocumentNode<{ repos: Repo[] }> = gql`
	query repos {
		repos {
			id
			name
		}
	}
`;

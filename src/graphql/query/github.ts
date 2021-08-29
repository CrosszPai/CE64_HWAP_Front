import { gql } from '@urql/svelte';

export const REPOS = gql`
	query repos {
		repos {
			id
			name
		}
	}
`;

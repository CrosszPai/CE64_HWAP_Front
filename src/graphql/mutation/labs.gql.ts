import { gql } from '@urql/core';
import type { TypedDocumentNode } from '@urql/core';
import type { lab } from 'src/global';

export const CREATE_LAB: TypedDocumentNode<
	{ createLab: lab },
	{ lab_name: string; lab_detail?: string; assets: File[]; repo_url: string; published?: boolean }
> = gql`
	mutation createLab(
		$lab_name: String!
		$lab_detail: String!
		$assets: [Upload!]!
		$repo_url: String!
		$published: Boolean!
	) {
		createLab(
			lab_name: $lab_name
			lab_detail: $lab_detail
			assets: $assets
			repo_url: $repo_url
			published: $published
		) {
			lab_name
			lab_detail
		}
	}
`;

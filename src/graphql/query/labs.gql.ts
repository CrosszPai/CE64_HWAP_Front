import { gql } from '@urql/core';
import type { TypedDocumentNode } from '@urql/core';
import type { Lab } from 'src/global';

export const SELF_LABS: TypedDocumentNode<{
	selfLabs: Lab[];
}> = gql`
	query selfLabs {
		selfLabs {
			id
			lab_name
			lab_detail
			assets {
				url
			}
			repo_url
		}
	}
`;

export const LAB: TypedDocumentNode<{ lab: Lab }, { id: number }> = gql`
	query lab($id: Float!) {
		lab(id: $id) {
			id
			lab_name
			lab_detail
			repo_url
			assets {
				url
			}
		}
	}
`;

export const LABS: TypedDocumentNode<{ publishedLab: Lab[] }> = gql`
	query publishedLab {
		publishedLab {
			id
			lab_name
			lab_detail
		}
	}
`;

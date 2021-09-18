import { gql } from '@urql/core';
import type { TypedDocumentNode } from '@urql/core';
import type { lab } from 'src/global';

export const SELF_LABS: TypedDocumentNode<{
    selfLabs: lab[];
}> = gql`
	query selfLabs {
		selfLabs {
			id
			lab_name
			lab_detail
		}
	}
`;

export const LAB: TypedDocumentNode<{ lab: lab }> = gql`
	query lab($id: Float!) {
		lab(id: $id) {
			id
			lab_name
			lab_detail
		}
	}
`;

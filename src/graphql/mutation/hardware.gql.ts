import { gql } from "@urql/core";
import type { TypedDocumentNode } from '@urql/core'
import type { Hardware } from "src/global";

export const ADD_HARDWARE: TypedDocumentNode<{
    addHardware: Hardware
}, {
    id: string
}> = gql`
  mutation addHardware($id:String!){
    addHardware(hwid:$id){
        id
        status
    }
  }
`
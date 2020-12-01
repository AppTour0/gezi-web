import gql from "graphql-tag";

export const getEnterprises = gql` 
  query getEnterprises{
    empresas(order_by: {id: asc}) {
      ativo
      bairro
      celular
      cep
      cidade
      cnpj
      complemento
      contrato
      data_cad
      cpf
      email
      endereco
      estado
      fantasia
      id
      especialidade
      nome
      numero
      razao_social
      sobrenome
      telefone
      recipient_id
      user {
        id
        level
      }
    }
  }
`;

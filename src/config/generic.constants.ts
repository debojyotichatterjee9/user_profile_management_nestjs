export enum Role {
  DEFAULT_USER = 'DEFAULT_USER',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum Permission {
  CREATE_ORGANIZATION = 'create_organization',
  READ_ORGANIZATION_LIST = 'read_organization_list',
  READ_ORGANIZATION_DETAIL = 'read_organization_detail',
  UPDATE_ORGANIZATION = 'update_organization',
  DELETE_ORGANIZATION = 'delete_organization',
  CREATE_USER = 'create_user',
  READ_USER_LIST = 'read_user_list',
  READ_USER_DETAIL = 'read_user_detail',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  CREATE_ROLE = 'create_role',
  READ_ROLE_LIST = 'read_role_list',
  READ_ROLE_DETAIL = 'read_role_detail',
  UPDATE_ROLE = 'update_role',
  DELETE_ROLE = 'delete_role',
  CREATE_PERMISSION = 'create_permission',
  READ_PERMISSION_LIST = 'read_permission_list',
  READ_PERMISSION_DETAIL = 'read_permission_detail',
  UPDATE_PERMISSION = 'update_permission',
  DELETE_PERMISSION = 'delete_permission',
}

export const PUBLIC_API_KEY = 'PUBLIC_API';

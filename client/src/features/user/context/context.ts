import React from 'react';
import { User } from '../../../models/user';

export const UserProfileContext = React.createContext<User | null>(null);

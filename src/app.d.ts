declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
			company: import('$lib/server/db/schema').Company[];
			selectedCompany: import('$lib/server/db/schema').Company | null;
		}
	}
}

export {};
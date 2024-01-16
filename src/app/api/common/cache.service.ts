import { Injectable } from '@angular/core';
// import * as moment from 'moment';
// import { DefineFunction } from '../../common/define/function.define';
import { CacheKeys } from '../../common/define/cache-keys.define';

const PREFIX: string = 'FILE_MANAGER_';
@Injectable()
export class CacheService {
	public static readonly CACHE_EXPIRE_TIME_DEFAULT = 60 * 60;
	public static readonly CACHE_1_DAY = 24 * 60 * 60;
	public static readonly CACHE_EXPIRE_NONE = -1;

	constructor() {
	}
  // support inject CacheService
	public get(key: string, default_value?: any) {
		// const keys = Object.keys(localStorage);
		// // if (!keys || !keys.length) {
		// // 	return;
		// // }
		// console.log('CacheService get keys=', keys, key);
		return CacheService.Get(key, default_value);
	}

	static Get(key: string, default_value?: any) {  // support cho những file không thể inject CacheService

		const cachedData = localStorage.getItem(`${PREFIX}${key}`);
		// console.log('Get key= ', `${PREFIX}${key}`, ' data=',cachedData);
		if (!cachedData) {
			return default_value;
		}
		try {
			const plainData = '' //DefineFunction.decrypt(cachedData);
			// console.log('plainData = ', plainData);
			const data = JSON.parse(plainData);
			
			if (data.expire === CacheService.CACHE_EXPIRE_NONE) {
				return data.value;
			}
			// const currentMillisecond = moment().unix();
			// if (data.expire < currentMillisecond) {
			// 	return default_value;
			// }
			return data.value;

		} catch (error) {
			// console.log('error = ', error);
			return default_value;
		}

	}

	private static getDefaultValueBySpecificKey(key: string, default_value: any) {
		switch (key) {
			// case CacheKeys.KEY_CACHE_SETTING_ALL:
			// 	return default_value || { data: [] };
		}
		return default_value;

	}

	static Set(key: string, value: any, expireTimeBySecond = CacheService.CACHE_1_DAY) { // support cho những file không inject CacheService
		if (!value) {
			return;
		}

		// const currentMillisecond = expireTimeBySecond === CacheService.CACHE_EXPIRE_NONE ? CacheService.CACHE_EXPIRE_NONE : moment().unix() + expireTimeBySecond;

		const data = {
			'value': value,
			'expire': ''//currentMillisecond
		};
		const plainData = JSON.stringify(data);
		try {
			// const decryptedData = DefineFunction.encrypt(plainData);
			// localStorage.setItem(`${PREFIX}${key}`, decryptedData);
		} catch (error) {
		}

	}

	public set(key: string, value: any, expireTimeBySecond = CacheService.CACHE_EXPIRE_TIME_DEFAULT) { // support inject CacheService
		CacheService.Set(key, value, expireTimeBySecond);
	}

	public clear(key: string) {
		localStorage.removeItem(key);
	}

	public static ClearAll() {
		const keys = Object.keys(localStorage);
		if (!keys || !keys.length) {
			return;
		}

		keys.forEach(key => {
			if (key.startsWith(PREFIX)) {
				localStorage.removeItem(key);
			}
		});
	}

	public clearAll() {
		CacheService.ClearAll();
	}

	public deleteKeyStartWith(text: string) {
		const keys = Object.keys(localStorage);
		if (!keys || !keys.length) {
			return;
		}

		keys.forEach(key => {
			if (key.startsWith(`${PREFIX}${text}`)) {
				this.clear(key);
			}
		});
	}
}

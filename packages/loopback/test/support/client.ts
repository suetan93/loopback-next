// Copyright IBM Corp. 2013,2017. All Rights Reserved.
// Node module: loopback
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Server, ServerConfig} from 'loopback';
import bluebird = require('bluebird');
import request = require('request-promise');
import {RequestResponse} from 'request';

// A workaround for a possible bug in request-promise .d.ts,
// where RequestResponse interface does not include "body"
// property as it should
// TODO(bajtos) contribute this fix back to definitely-typed
interface FullRequestResponse extends RequestResponse {
  readonly body: any;
}

export class Client {
  constructor(public app : Server) {

  }

  public async get(path : string) : Promise<Client.Result> {
    await this._ensureAppIsListening();

    const url = 'http://localhost:' + this.app.config.port + path;
    const options = {
      uri: url,
      resolveWithFullResponse: true,
    } as any;

    const response = await this._request(options);
    return {
      status: response.statusCode,
      body: response.body,
    };
  }

  private async _ensureAppIsListening(): Promise<void> {
    await this.app.start();
  }

  // A workaround to fix incorrect type information for
  // the return value of request()
// TODO(bajtos) contribute this fix back to definitely-typed
  private async _request(options): Promise<FullRequestResponse> {
    return request(options);
  }
}

export module Client {
  export interface Result {
    status: number;
    body: any;
  }
}

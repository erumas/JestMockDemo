### this has an example of dependency mocking in jest unit tests using the jest.mock() function. According to the documentation jest doesn't fully support mocking ECMA script modules, but with a small work around it seems to work

#### There is some experimental support for ecma modules, but I am not interested in basing my testing harness on them until they have supoort
jest.unstable_mockModule() is the way one can*, but no thansk 


IN JEST DOCUMENTATION THE OFFER THE FOLLOWING:

Module mocking in ESM

Since ESM evaluates static import statements before looking at the code, the hoisting of jest.mock calls that happens in CJS won't work for ESM. To mock modules in ESM, you need to use require or dynamic import() after jest.mock calls to load the mocked modules - the same applies to modules which load the mocked modules.

ESM mocking is supported through jest.unstable_mockModule. As the name suggests, this API is still work in progress, please follow this issue for updates.

The usage of jest.unstable_mockModule is essentially the same as jest.mock with two differences: the factory function is required and it can be sync or async:
```
import {jest} from '@jest/globals';

jest.unstable_mockModule('node:child_process', () => ({
  execSync: jest.fn(),
  // etc.
}));

const {execSync} = await import('node:child_process');

// etc.
```


* This example mocks an ES6 class with the module factory parameter

```
jest.mock('../../../usecases/token-revoke/token-revoke', () => ({
  TokenRevokeUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn(),
  })),
}))
```

* The problem is that trying to do the following, which would allow you to alter the return value of your mock, doesn't work as expected

```
let mockShouldUserLeewayRefresh = () => {}

jest.mock('../../../../utils/feature-utils', () => ({
  shouldUseLeewayRefreshToken: () => mockShouldUseLeewayRefreshToken,
}))
```

This uses the same module factory param but instead it is mocking an ESM module, which is not technically supported. The problem is that jest.mock() are hoisted to the top, so trying to insert a variable into the module you are mocking (t.e. shouldUseLeewayRefresh: ) will result in a

ReferenceError: Cannot access 'mock…' before initialization
because during compliation what happesn is:

```
jest.mock('../../../../utils/feature-utils', () => ({
  shouldUseLeewayRefreshToken: () => mockShouldUseLeewayRefreshToken,
}))

var mockShouldUserLeewayRefresh = () => {}
```

Acccording to jest documentation:
Since calls to jest.mock() are hoisted to the top of the file, Jest prevents access to out-of-scope variables. By default, you cannot first define a variable and then use it in the factory. Jest will disable this check for variables that start with the word mock. However, it is still up to you to guarantee that they will be initialized on time. Be aware of Temporal Dead Zone.
SOLUTION:

We assign a jest.fn() factory method to a variable that is the return value of an anonymous function so that in compilation everyting is initialized before it's used. Then later in our test block we can update the return value of our mock. This in turn allows us to have the mocks return different values in different it() blocks

```
const mockShouldUseLeewayRefreshToken = jest.fn()
jest.mock('../../../../utils/feature-utils', () => ({
  shouldUseLeewayRefreshToken: () => mockShouldUseLeewayRefreshToken(),
}))

...

it(..) {
    // here we alter the return value of the mocked function in the esm module
    mockShouldUseLeewayRefreshToken.mockReturnValue(true)

   ...
}

```


dpkg, rpm, npm, yarn or any package manager 
    ---->
    node_modules 
        ----> 
            where modules are located (we all know this)
                --->
                    require()
                        Node built in method to craw the module dir and return the package as an es module (The node_modules folders are relative, and based on the real file loc of the module calling require)  
                            --------------
                                          |
                                          |
                            --------------
                            |
                            |----> Module Cache
                                    Once a module is loaded, it's cached here to improve performance for subsequent imports.
                                        ---->
                                            V8 Engine: The cached modules are compiled and executed in the V8 JavaScript engine


In a jest environmet we leverage the Node VM
    The node:vm module enables compiling and running code within V8 Virtual Machine contexts.

So jest runs in a virtual env, which has several advantages. One is all tests are run in isolation with their own vm contest, which is why so much code can be run in parallel. 

Secondly and more importantly for our usage we can swap out modules at runtime, so just before the require stage, FOR EACH, individual test jest can determine which module, the mocked or 'real' module can be provided to the Module cache and then compiler.


Becuase each test is run in it's own virtual context we can assing a jest factory method to our mock, BUT change the variable at the test level i.e. it() or describe() blocks and updated the behavior of our factory functions, modules, or classes

The following is how jest makes module determiniations at runtime a

https://github.com/jestjs/jest/blob/46c9c13811ca20a887e2826c03852f2ccdebda7a/packages/jest-runtime/src/index.ts#L531
```
  private resolveModule<T = unknown>(
    specifier: string,
    referencingIdentifier: string,
    context: VMContext,
  ): Promise<T> | T | void {
    if (this.isTornDown) {
      this._logFormattedReferenceError(
        'You are trying to `import` a file after the Jest environment has been torn down.',
      );
      process.exitCode = 1;
      return;
    }

    if (specifier === '@jest/globals') {
      const fromCache = this._esmoduleRegistry.get('@jest/globals');

      if (fromCache) {
        return fromCache;
      }
      const globals = this.getGlobalsForEsm(referencingIdentifier, context);
      this._esmoduleRegistry.set('@jest/globals', globals);

      return globals;
    }

    if (specifier.startsWith('file://')) {
      specifier = fileURLToPath(specifier);
    }

    const [path, query] = specifier.split('?');

    if (
      this._shouldMock(
        referencingIdentifier,
        path,
        this._explicitShouldMockModule,
        {conditions: this.esmConditions},
      )
    ) {
      return this.importMock(referencingIdentifier, path, context);
    }

    const resolved = this._resolveModule(referencingIdentifier, path, {
      conditions: this.esmConditions,
    });

    if (
      this._resolver.isCoreModule(resolved) ||
      this.unstable_shouldLoadAsEsm(resolved)
    ) {
      return this.loadEsmModule(resolved, query);
    }

    return this.loadCjsAsEsm(referencingIdentifier, resolved, context);
  }
```


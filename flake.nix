{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    systems.url = "github:nix-systems/default";
  };
  outputs =
    { nixpkgs, systems, ... }:
    let
      forEachSystem = nixpkgs.lib.genAttrs (import systems);
    in
    {
      devShells = forEachSystem (system: {
        default =
          let
            pkgs = import nixpkgs {
              inherit system;
              config.allowUnfree = true;
            };

            # This is the Python version that will be used.
            myPython = pkgs.python3;

            pythonWithPkgs = myPython.withPackages (
              ps: with ps; [
                pip
                setuptools
                wheel
              ]
            );

            lib-path =
              with pkgs;
              lib.makeLibraryPath [
                libffi
                openssl
              ];
          in
          pkgs.mkShell {

            buildInputs = [
              # my python and packages
              pythonWithPkgs
              pkgs.memcached
              pkgs.redis

              # other packages needed for compiling python libs
              pkgs.readline
              pkgs.libffi
              pkgs.openssl
              pkgs.krb5

              # JS/TS
              pkgs.nodejs
              # You can set the major version of Node.js to a specific one instead of the default version
              # pkgs.nodejs-19_x

              # You can choose pnpm, yarn, bun, or none (npm).
              # pkgs.nodePackages.pnpm
              # pkgs.yarn
              pkgs.bun

              pkgs.typescript
              pkgs.nodePackages.typescript-language-server
            ];

            shellHook =
              let
                python_virtualenv_folder_name = "venv";
              in
              ''
                # Allow the use of wheels.
                SOURCE_DATE_EPOCH=$(${pkgs.coreutils}/bin/date +%s)
                VENV_PATH=$(${pkgs.coreutils}/bin/pwd)/${python_virtualenv_folder_name}
                # Augment the dynamic linker path
                export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:${lib-path}"

                # Setup the virtual environment if it doesn't already exist.
                if ${pkgs.coreutils}/bin/test ! -d $VENV_PATH; then
                  ${myPython}/bin/python -m venv $VENV_PATH
                fi
                $VENV_PATH/bin/pip install -U -r requirements.txt
                source $VENV_PATH/bin/activate
                export PYTHONPATH=$VENV_PATH/${myPython.sitePackages}/:$PYTHONPATH
              '';
          };
      });

      formatter = forEachSystem (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        pkgs.nixfmt-rfc-style
      );
    };
}

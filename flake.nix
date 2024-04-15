# {
#   inputs = {
#     nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
#     systems.url = "github:nix-systems/default";
#   };
#   outputs = {nixpkgs, systems, ...}: let
#     forEachSystem = nixpkgs.lib.genAttrs (import systems);
#   in
#     forEachSystem(system:
#         let
#           pkgs = import nixpkgs {
#             inherit system;
#           };
#         in
#         {
#           formatter = pkgs.nixpkgs-fmt;

#           # devShells.default = pkgs.mkShell {
#           #   buildInputs = [
#           #     pkgs.nodejs
#           #     # You can set the major version of Node.js to a specific one instead of the default version
#           #     # pkgs.nodejs-19_x

#           #     # You can choose pnpm, yarn, bun, or none (npm).
#           #     # pkgs.nodePackages.pnpm
#           #     # pkgs.yarn
#           #     pkgs.bun

#           #     pkgs.typescript
#           #     pkgs.nodePackages.typescript-language-server
#           #   ];

#           #   shellHook = ''
#           #     # Tells pip to put packages into $PIP_PREFIX instead of the usual locations.
#           #     # See https://pip.pypa.io/en/stable/user_guide/#environment-variables.
#           #     export PIP_PREFIX=$(pwd)/_build/pip_packages
#           #     export PYTHONPATH="$PIP_PREFIX/${pkgs.python3.sitePackages}:$PYTHONPATH"
#           #     export PATH="$PIP_PREFIX/bin:$PATH"
#           #     unset SOURCE_DATE_EPOCH
#           #   '';
#           # };
#           devShells.default = pkgs.mkShell {};
#         }
#       );
# }


{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    systems.url = "github:nix-systems/default";
  };
  outputs = { nixpkgs, systems, ... }:
    let
      forEachSystem = nixpkgs.lib.genAttrs (import systems);
    in
    {
      devShells = forEachSystem (system: {
        default =
          let
            pkgs = import nixpkgs {
              inherit system;
            };
            my-python = pkgs.python3.withPackages (ps: with ps; [
              black
              pip
            ]);
          in
          pkgs.mkShell {
            buildInputs = [
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

              # Python
              my-python
            ];

            shellHook = ''
              # Tells pip to put packages into $PIP_PREFIX instead of the usual locations.
              # See https://pip.pypa.io/en/stable/user_guide/#environment-variables.
              export PIP_PREFIX=$(pwd)/_build/pip_packages
              export PYTHONPATH="$PIP_PREFIX/${my-python.sitePackages}:$PYTHONPATH"
              export PATH="$PIP_PREFIX/bin:$PATH"
              unset SOURCE_DATE_EPOCH
              pip install -r requirements.txt
            '';
          };
      });
    };
}

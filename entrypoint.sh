#!/bin/sh
echo "-> Starting $APP_NAME"
echo "Entry point args: ${*:-<none>}"

test() {
    echo "#### Running test ####"
    lerna run test
}

push () {
    echo '### Publishing all packages'
    yarn run pack-all
    #push
    rm -rf ./tgzs
    echo "Done"
}

shell () {
    echo "Welcome to the Shell"
    sh
}

COMMAND=$1; shift
case $COMMAND in
    push)
        push $*
    ;;
    test)
        test $*
    ;;
    shell)
        shell $*
    ;;
    *)
        echo "[!] Invalid or no command specified [$COMMAND]. Available commands: start or shell"
        exit 1
    ;;
esac

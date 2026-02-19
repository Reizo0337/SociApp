#!/bin/bash

# Contenedores definidos en docker-compose.yml
CONTAINERS=("sociapp_frontend" "sociapp_backend")

show_main_menu() {
    echo "============================"
    echo "   SociApp Control Script    "
    echo "============================"
    echo "Elige el contenedor:"
    for i in "${!CONTAINERS[@]}"; do
        echo "$((i+1))) ${CONTAINERS[$i]}"
    done
    echo "$(( ${#CONTAINERS[@]} + 1 ))) Exit"
    echo -n "Opción: "
}

show_action_menu() {
    echo ""
    echo "Acciones para $1:"
    echo "1) Build & Start"
    echo "2) Restart"
    echo "3) Stop"
    echo "4) Logs"
    echo "5) Volver al menú principal"
    echo -n "Elige una acción: "
}

while true; do
    show_main_menu
    read cont_option

    if [[ $cont_option -ge 1 && $cont_option -le ${#CONTAINERS[@]} ]]; then
        CONTAINER_NAME="${CONTAINERS[$((cont_option-1))]}"
    elif [[ $cont_option -eq $(( ${#CONTAINERS[@]} + 1 )) ]]; then
        echo "Saliendo..."
        exit 0
    else
        echo "Opción inválida"
        continue
    fi

    while true; do
        show_action_menu $CONTAINER_NAME
        read action_option
        case $action_option in
            1)
                echo "Reconstruyendo y arrancando $CONTAINER_NAME..."
                docker-compose build $CONTAINER_NAME
                docker-compose up -d $CONTAINER_NAME
                ;;
            2)
                echo "Reiniciando $CONTAINER_NAME..."
                docker restart $CONTAINER_NAME
                ;;
            3)
                echo "Deteniendo $CONTAINER_NAME..."
                docker stop $CONTAINER_NAME
                ;;
            4)
                echo "Mostrando logs de $CONTAINER_NAME (Ctrl+C para salir)..."
                docker logs -f $CONTAINER_NAME
                ;;
            5)
                break
                ;;
            *)
                echo "Opción inválida"
                ;;
        esac
        echo ""
    done
done

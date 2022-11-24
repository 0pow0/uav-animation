for f in uav_coordinate_reactive*\.csv\.bak;
do
    echo "${f%.bak}";
    mv "$f" "${f%.bak}";
done
